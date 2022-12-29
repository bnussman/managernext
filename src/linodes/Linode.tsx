import { Box, Card, CardBody, Code, Heading, HStack, ListItem, Spacer, Stack, Stat, StatHelpText, StatLabel, StatNumber, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, UnorderedList, Wrap, WrapItem } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { useLinodeQuery } from '../queries/linodes';
import { Indicator } from '../components/Indicator';
import { statusMap } from './Linodes';
import { Stats } from './Stats';
import { Volumes } from './Volumes';
import { Disks } from './Disks';
import { Backups } from './backups/Backups';
import { Configs } from './configs/Configs';
import { Network } from './network/Network';
import { Settings } from './settings/Settings';
import { dcDisplayNames } from '../utils/constants';

const tabs = [
  "Stats",
  "Disks",
  "Volumes",
  "Backups",
  "Configurations",
  "Network",
  "Settings",
];

export function Linode() {
  const { id, tab } = useParams();
  const navigate = useNavigate();

  const { data: linode, isLoading, error } = useLinodeQuery(Number(id));

  const onTabChange = (index: number) => {
    navigate(`/linodes/${id}/${tabs[index].toLowerCase()}`);
  };

  const tabIndex = tabs.findIndex(t => tab === t.toLowerCase());

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Unable to load your Linodes" />
  }

  return (
    <Stack>
      <Card variant="outline">
        <CardBody>
          <Stack spacing={4}>
            <HStack>
              <Heading size="md" isTruncated>{linode.label}</Heading>
              <Spacer />
              <Text fontWeight="extrabold" textTransform="capitalize">{linode.status.replaceAll("_", " ")}</Text>
              <Indicator color={statusMap[linode.status]} />
            </HStack>
            <Wrap spacingX={16}>
              <WrapItem>
                <Stat>
                  <StatLabel>CPU</StatLabel>
                  <StatNumber>{linode.specs.vcpus}</StatNumber>
                  <StatHelpText>CPUs</StatHelpText>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Stat>
                  <StatLabel>RAM</StatLabel>
                  <StatNumber>{linode.specs.memory / 1024}</StatNumber>
                  <StatHelpText>GB</StatHelpText>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Stat>
                  <StatLabel>Disk</StatLabel>
                  <StatNumber>{linode.specs.disk / 1024}</StatNumber>
                  <StatHelpText>GB</StatHelpText>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Stat>
                  <StatLabel>Region</StatLabel>
                  <StatNumber>{dcDisplayNames[linode.region]}</StatNumber>
                  <StatHelpText textTransform="uppercase">{linode.region.split("-")[0]}</StatHelpText>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Box>
                  <Heading size="sm">IPv4</Heading>
                  {linode.ipv4.map((ip) => (
                    <Text key={ip}>
                      <Code>{ip}</Code>
                    </Text>
                  ))}
                </Box>
              </WrapItem>
              <WrapItem>
                <Box>
                  <Heading size="sm">IPv6</Heading>
                  <Text>
                    <Code>{linode.ipv6}</Code>
                  </Text>
                </Box>
              </WrapItem>
            </Wrap>
          </Stack>
        </CardBody>
      </Card>
      <Tabs colorScheme="gray" index={tabIndex === -1 ? 0 : tabIndex} onChange={onTabChange} isLazy>
        <Box overflowX="auto">
          <TabList>
            <Tab>Stats</Tab>
            <Tab>Disks</Tab>
            <Tab>Volumes</Tab>
            <Tab>Backups</Tab>
            <Tab>Configurations</Tab>
            <Tab>Network</Tab>
            <Tab>Settings</Tab>
          </TabList>
        </Box>
        <TabPanels>
          <TabPanel>
            <Stats id={linode.id} />
          </TabPanel>
          <TabPanel>
            <Disks id={linode.id} />
          </TabPanel>
          <TabPanel>
            <Volumes id={linode.id} />
          </TabPanel>
          <TabPanel>
            <Backups id={linode.id} />
          </TabPanel>
          <TabPanel>
            <Configs id={linode.id} />
          </TabPanel>
          <TabPanel>
            <Network id={linode.id} />
          </TabPanel>
          <TabPanel>
            <Settings linode={linode} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}