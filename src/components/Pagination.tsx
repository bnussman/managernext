import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Flex, HStack, Select, Spacer, Text, useMediaQuery } from "@chakra-ui/react";

interface PaginationProps {
  results?: number;
  limit?: number;
  cutoff?: number;
  neighbors?: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

interface DirectionButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}

interface PageButtonProps {
  active?: boolean;
  children?: any;
  onClick?: () => void;
  isDisabled?: boolean;
}

function PageButton(props: PageButtonProps) {
  const { onClick, active, children } = props;
  const [isDesktop] = useMediaQuery('(min-width: 800px)')

  return (
    <Button onClick={onClick} disabled={active} size={!isDesktop ? "sm": undefined}>
      {children}
    </Button>
  );
}

function DirectionButton(props: DirectionButtonProps) {
  const { disabled, onClick, direction } = props;
  const [isDesktop] = useMediaQuery('(min-width: 800px)')

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      size={!isDesktop ? "sm": undefined}
    >
      {direction === 'right' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </Button>
  )
}

export function Pagination({
  results = 0,
  limit = 25,
  cutoff = 3,
  neighbors = 1,
  page,
  setPage,
  pageSize,
  setPageSize
}: PaginationProps) {

  const pages = [],
    numButtons = ((cutoff * 2) + 1),
    pageCount = Math.ceil(results / limit);

  function increment() {
    if (page < pageCount) {
      setPage(page + 1);
    }
  }
  function decrement() {
    if (page > 0) {
      setPage(page - 1);
    }
  }

  // Small page count - show all numbers
  if (pageCount < numButtons) {
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      pages.push(pageNum);
    }
  }
  // Beginning of sequence
  else if (page <= cutoff) {
    for (let pageNum = 1; pageNum <= numButtons - 2; pageNum++) {
      pages.push(pageNum);
    }
    pages.push(null);
    pages.push(pageCount)
  }
  // End of sequence
  else if (page >= (pageCount - cutoff)) {
    pages.push(1)
    pages.push(null);
    for (let pageNum = pageCount - (numButtons - 3); pageNum <= pageCount; pageNum++) {
      pages.push(pageNum);
    }
  }
  // Middle of sequence
  else {
    pages.push(1);
    pages.push(null);
    for (let pageNum = page - neighbors; pageNum <= page + neighbors; pageNum++) {
      pages.push(pageNum);
    }
    pages.push(null);
    pages.push(pageCount);
  }

  return (
    <Box mb={2} mt={2}>
      <Flex align="center">
        <Text noOfLines={1}>
          {`Showing ${(page - 1) * limit + 1} to ${page * limit <= results ? page * limit : results}	of ${results} results`}
        </Text>
        <Spacer />
        <HStack>
          <Select disabled={results <= pageSize} value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
          </Select>
          <ButtonGroup isAttached>
            <DirectionButton direction='left' disabled={page === 1} onClick={decrement} />
            {
              pages.map((p, index) => 
                p ? (
                    <PageButton
                      key={index}
                      active={page === p}
                      onClick={() => setPage(page)}
                    >
                      {page}
                    </PageButton>
                  )
                  : <PageButton key={index} isDisabled>...</PageButton>
              )
            }
            <DirectionButton direction='right' disabled={page === pageCount || results === 0} onClick={increment} />
          </ButtonGroup>
        </HStack>
      </Flex>
    </Box>
  );
}