import { Pagination as PaginationComponent, PaginationProps } from '@mui/material';

interface Props extends PaginationProps {}

export const Pagination = (props: Props) => {
  const { page, count, siblingCount, boundaryCount, onChange, ...rest } = props;

  return (
    <PaginationComponent
      color="primary"
      boundaryCount={boundaryCount ?? 1}
      siblingCount={siblingCount ?? 0}
      page={page ?? 1}
      onChange={onChange ?? null}
      count={count ?? 0}
      variant="outlined"
      shape="rounded"
      {...rest}
    />
  );
};
