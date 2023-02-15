import { AreaChart, Area, Tooltip, ResponsiveContainer, TooltipProps, XAxis } from 'recharts';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { useLinodeStatsQuery } from '../queries/linodes';
import { Card, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { memo } from 'react';

interface Props {
  id: number;
}

export const Stats = memo(({ id }: Props) => {
  const { data: stats, isLoading, error } = useLinodeStatsQuery(id);

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Can't load Linode stats" />;
  }

  const margin = {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  };

  const BITS_PER_MB = 8000000;

  const network = stats.data.netv4.in.map(([x, y]) => ({
    time: x,
    in: y / BITS_PER_MB,
    out: (stats.data.netv4.out.find(item => item[0] === x)?.[1] ?? 0) / BITS_PER_MB,
    private_in: (stats.data.netv4.private_in.find(item => item[0] === x)?.[1] ?? 0) / BITS_PER_MB,
    private_out: (stats.data.netv4.private_out.find(item => item[0] === x)?.[1] ?? 0) / BITS_PER_MB
  }));

  return (
    <Stack w="100%" spacing={4}>
      <Card h="300" variant="outline">
        <Heading p={4} size="lg" fontWeight="extrabold" letterSpacing="tighter" position="absolute" zIndex={10}>CPU</Heading>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={stats.data.cpu.map(([x, y]) => ({ time: x, value: y }))}
            margin={margin}
          >
            <XAxis dataKey="time" scale="time" hide />
            <Tooltip content={<CUPTooltip />} wrapperStyle={{ outline: "none" }} />
            <Area type="monotone" dataKey="value" stroke="#85b4f2" fill="#85b4f2" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card h="300" variant="outline">
        <Heading p={4} size="lg" fontWeight="extrabold" letterSpacing="tighter" position="absolute" zIndex={10}>Disk</Heading>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={stats.data.io.io.map(([x, y]) => ({ time: x, value: y }))}
            margin={margin}
          >
            <XAxis dataKey="time" scale="time" hide />
            <Tooltip content={<DiskTooltip />} wrapperStyle={{ outline: "none" }} />
            <Area type="monotone" dataKey="value" stroke="#85b4f2" fill="#85b4f2" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card h="300" variant="outline">
        <Heading p={4} size="lg" fontWeight="extrabold" letterSpacing="tighter" position="absolute" zIndex={10}>Network</Heading>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={network}
            margin={margin}
          >
            <XAxis dataKey="time" scale="time" hide />
            <Tooltip content={<NetworkTooltip />} wrapperStyle={{ outline: "none" }} />
            <Area type="monotone" dataKey="in" stroke="#85b4f2" fill="#85b4f2" />
            <Area type="monotone" dataKey="out" stroke="#735ac7" fill="#735ac7" />
            <Area type="monotone" dataKey="private_in" stroke="#8adbd3" fill="#8adbd3" />
            <Area type="monotone" dataKey="private_out" stroke="#4a32e6" fill="#4a32e6" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </Stack>
  )
});

const NetworkTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <Card p={2} variant="filled">
        <Heading size="sm">{new Date(label).toLocaleTimeString()}</Heading>
        {payload.map(item => (
          <HStack>
            <Text fontWeight="extrabold">{item.name}:</Text>
            <Text>{item.value} MB/s</Text>
          </HStack>
        ))}
      </Card>
    );
  }

  return null;
};

const CUPTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <Card p={2} variant="filled">
        <Heading size="sm">{new Date(label).toLocaleTimeString()}</Heading>
        <Text>{payload[0].value}%</Text>
      </Card>
    );
  }

  return null;
};

const DiskTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <Card p={2} variant="filled">
        <Heading size="sm">{new Date(label).toLocaleTimeString()}</Heading>
        <Text>{payload[0].value} blocks/s</Text>
      </Card>
    );
  }

  return null;
};