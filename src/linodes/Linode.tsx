import { Box, Card, CardBody, CardHeader, Center, Heading, HStack, ListItem, Spacer, Stack, Stat, StatHelpText, StatLabel, StatNumber, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, UnorderedList, Wrap, WrapItem } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { useLinodeQuery } from '../queries/linodes';
import { Indicator } from '../components/Indicator';
import { statusMap } from './Linodes';

export function Linode() {
  const { id } = useParams();

  const { data: linode, isLoading, error } = useLinodeQuery(Number(id));

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  return (
    <Stack>
      <Card variant="outline">
        <CardBody>
          <Stack spacing={4}>
            <HStack>
              <Heading size="md" isTruncated>{linode.label}</Heading>
              <Tag>{linode.id}</Tag>
              <Spacer />
              <Text fontWeight="extrabold" textTransform="capitalize">{linode.status}</Text>
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
                  <StatNumber>{linode.specs.memory}</StatNumber>
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
                <Box>
                  <Heading size="sm">IPv4</Heading>
                  <UnorderedList>
                    {linode.ipv4.map((ip) => (
                      <ListItem key={ip}>{ip}</ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              </WrapItem>
              <WrapItem>
                <Box>
                  <Heading size="sm">IPv6s</Heading>
                  <UnorderedList>
                    <ListItem>{linode.ipv6}</ListItem>
                  </UnorderedList>
                </Box>
              </WrapItem>
            </Wrap>
          </Stack>
        </CardBody>
      </Card>
      <Tabs colorScheme="gray">
        <TabList>
          <Tab>Stats</Tab>
          <Tab>Backups</Tab>
          <Tab>Configurations</Tab>
          <Tab>Network</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            Stats
          </TabPanel>
          <TabPanel>
            Backups
          </TabPanel>
          <TabPanel>
            Configs
          </TabPanel>
          <TabPanel>
            Network
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}