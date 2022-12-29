import { AreaChart, Area, YAxis, Tooltip, ResponsiveContainer, TooltipProps, XAxis } from 'recharts';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { useLinodeStatsQuery } from '../queries/linodes';
import { Card, Heading, HStack, Stack, Text } from '@chakra-ui/react';

interface Props {
  id: number;
}

export function Stats({ id }: Props) {
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
    <Stack w="100%" h={800} spacing={4}>
      <Card h="300" variant="outline">
        <Heading p={4} size="lg" fontWeight="extrabold" letterSpacing="tighter" position="absolute" zIndex={10}>CPU</Heading>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={stats.data.cpu.map(([x, y]) => ({ name: x, value: y, amt: y }))}
            margin={margin}
          >
            {/* <YAxis mirror /> */}
            <Tooltip content={<CUPTooltip />} wrapperStyle={{ outline: "none" }} />
            <Area type="monotone" dataKey="value" stroke="rgb(104, 211, 145)" fill="rgb(104, 211, 145)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card h="300" variant="outline">
        <Heading p={4} size="lg" fontWeight="extrabold" letterSpacing="tighter" position="absolute" zIndex={10}>Disk</Heading>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={stats.data.io.io.map(([x, y]) => ({ name: x, value: y, amt: y }))}
            margin={margin}
          >
            {/* <YAxis mirror /> */}
            <Tooltip content={<DiskTooltip />} wrapperStyle={{ outline: "none" }} />
            <Area type="monotone" dataKey="value" stroke="rgb(104, 211, 145)" fill="rgb(104, 211, 145)" />
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
            {/* <YAxis mirror /> */}
            <XAxis dataKey="time" scale="time" hide />
            <Tooltip content={<NetworkTooltip />} wrapperStyle={{ outline: "none" }} />
            <Area type="monotone" dataKey="in" stroke="rgb(104, 211, 145)" fill="rgb(104, 211, 145)" />
            <Area type="monotone" dataKey="out" stroke="#70d157" fill="#70d157" />
            <Area type="monotone" dataKey="private_in" stroke="#a5c729" fill="#a5c729" />
            <Area type="monotone" dataKey="private_out" stroke="#d4ba00" fill="#d4ba00" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </Stack>
  )
}

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