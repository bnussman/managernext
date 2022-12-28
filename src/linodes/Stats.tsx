import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { useLinodeStats } from '../queries/linodes';
import { Box } from '@chakra-ui/react';

interface Props {
  id: number;
}

export function Stats({ id }: Props) {
  const { data: stats, isLoading, error } = useLinodeStats(id);

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error />;
  }

  return (
    <Box w="100%" h={400}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={200}
        height={60}
        data={stats.data.cpu.map(([x, y]) => ({ name: x, value: y, amt: y }))}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <YAxis mirror />
        <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
    </Box>
  )
}