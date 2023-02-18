import { useLinodesQuery, useLinodeTypesQuery } from "../queries/linodes";
import { Linode } from "@linode/api-v4";
import { Indicator } from "../components/Indicator";
import { useNavigate } from "react-router-dom";
import { Menu } from "./Menu";
import { Column } from "../utils/useColumns";
import { Table } from "../utils/Table";
import { dcDisplayNames } from "../utils/constants";
import {
  Button,
  Heading,
  HStack,
  Spacer,
  Text,
  BoxProps,
  Stack,
  Card,
  Box,
  Code,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

export const statusMap: Record<Linode["status"], BoxProps["bgColor"]> = {
  running: 'green.300',
  shutting_down: 'orange.300',
  stopped: 'red.300',
  rebooting: 'orange.300',
  restoring: 'orange.300',
  rebuilding: 'orange.300',
  offline: "gray.400",
  deleting: "red.300",
  booting: 'orange.300',
  migrating: 'orange.300',
  provisioning: 'orange.300',
  cloning: 'orange.300',
}

export function Linodes() {
  const navigate = useNavigate();
  const columns: Column<Linode>[] = [
    {
      label: "ID",
      key: 'id',
      filterable: true,
      hidden: true,
    },
    {
      label: "Label",
      key: 'label',
      filterable: true
    },
    {
      label: "Status",
      key: 'status',
      transform({ status }) {
        return (
          <HStack>
            <Indicator color={statusMap[status]} />
            <Text textTransform="capitalize">{status.replaceAll('_', ' ')}</Text>
          </HStack>
        );
      },
    },
    {
      label: "Type",
      key: 'type',
      hidden: true,
      filterable: true,
      transform({ type }) {
        const Type = () => {
          const { data: types } = useLinodeTypesQuery();
          return <p>{types?.data.find(t => t.id === type)?.label ?? type}</p>;
        };
        return <Type />
      },
    },
    {
      label: "IPv4",
      key: 'ipv4',
      transform({ ipv4 }) {
        return ipv4[0];
      },
    },
    {
      label: "Region",
      key: 'region',
      transform({ region }) {
        return dcDisplayNames[region] ?? region;
      },
    },
    {
      label: "Updated",
      key: 'updated',
      filterable: true,
      hidden: true,
    },
    {
      label: "Created",
      key: 'created',
      filterable: true
    },
    {
      label: "Actions",
      tdProps: { p: 0, textAlign: 'center' },
      hideLabel: true,
      transform(linode, compact) {
        return (
          <Menu linode={linode} compact={compact} />
        );
      }
    },
  ]

  return (
    <Stack>
      <HStack>
        <Heading letterSpacing="tight" size="lg">Linodes</Heading>
        <Spacer />
        <Button onClick={() => navigate("/linodes/create")}>
          Create Linode
        </Button>
      </HStack>
      <Table
        entity="linodes"
        columns={columns}
        query={useLinodesQuery}
        card={(linode) => (
          <Card variant="outline" p={4} onClick={() => navigate(`/linodes/${linode.id}`)}>
            <Stack>
              <HStack>
                <Heading size="sm">
                  {linode.label}
                </Heading>
                <Spacer />
                <Menu linode={linode} />
              </HStack>
              <Wrap spacingX={16}>
                <WrapItem>
                  <Stat>
                    <StatLabel>Status</StatLabel>
                    <StatNumber>
                      <HStack>
                        <Text fontWeight="extrabold" textTransform="capitalize">{linode.status.replaceAll("_", " ")}</Text>
                        <Indicator color={statusMap[linode.status]} />
                      </HStack>
                    </StatNumber>
                    <StatHelpText>Status</StatHelpText>
                  </Stat>
                </WrapItem>
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
                    <StatNumber>{dcDisplayNames[linode.region] ?? linode.region}</StatNumber>
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
              </Wrap>
            </Stack>
          </Card>
        )}
        clickable
      />
    </Stack>
  );
};