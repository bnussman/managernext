import { Box, Card, CardBody, Code, Heading, HStack, Stack, Stat, StatHelpText, StatLabel, StatNumber, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { useNodeBalancerQuery } from '../queries/nodebalancers';
import { useRegionQuery } from '../queries/regions';
import { Stats } from './Stats';

const tabs = [
  "Stats",
  "Configurations",
  "Settings",
];

export function NodeBalancer() {
  const { id, tab } = useParams();
  const navigate = useNavigate();

  const { data: nodebalancer, isLoading, error } = useNodeBalancerQuery(Number(id));
  const { data: region } = useRegionQuery(nodebalancer?.region ?? '', Boolean(nodebalancer));

  const onTabChange = (index: number) => {
    navigate(`/nodebalancers/${id}/${tabs[index].toLowerCase()}`);
  };

  const tabIndex = tabs.findIndex(t => tab === t.toLowerCase());

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Unable to load your NodeBalancer" />
  }

  return (
    <Stack>
      <Card variant="outline">
        <CardBody>
          <Stack spacing={4}>
            <HStack>
              <Heading size="md" isTruncated>{nodebalancer.label}</Heading>
            </HStack>
            <Wrap spacingX={12}>
              <WrapItem>
                <Stat>
                  <StatLabel>Transfer In</StatLabel>
                  <StatNumber>{nodebalancer.transfer.in.toFixed(0)}</StatNumber>
                  <StatHelpText>MB</StatHelpText>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Stat>
                  <StatLabel>Transfer Out</StatLabel>
                  <StatNumber>{nodebalancer.transfer.out.toFixed(0)}</StatNumber>
                  <StatHelpText>MB</StatHelpText>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Stat>
                  <StatLabel>Region</StatLabel>
                  <StatNumber>{region?.label ?? nodebalancer.region}</StatNumber>
                  <StatHelpText>{region?.country.toUpperCase()}</StatHelpText>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Stat>
                  <StatLabel>IPv4</StatLabel>
                  <StatNumber>{nodebalancer.ipv4}</StatNumber>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Stat>
                  <StatLabel>IPv6</StatLabel>
                  <StatNumber>{nodebalancer.ipv6}</StatNumber>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Stat>
                  <StatLabel>Hostname</StatLabel>
                  <StatNumber>{nodebalancer.hostname}</StatNumber>
                </Stat>
              </WrapItem>

            </Wrap>
          </Stack>
        </CardBody>
      </Card>
      <Tabs colorScheme="gray" index={tabIndex === -1 ? 0 : tabIndex} onChange={onTabChange} isLazy>
        <Box overflowX="auto">
          <TabList>
            {tabs.map(tab => <Tab>{tab}</Tab>)}
          </TabList>
        </Box>
        <TabPanels>
          <TabPanel>
            <Stats id={nodebalancer.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}