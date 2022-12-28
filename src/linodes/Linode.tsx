import { Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { useLinodeQuery } from '../queries/linodes';

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
    <Text>{linode.label}</Text>
  );
}