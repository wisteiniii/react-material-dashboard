import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, employees, ...rest }) => {
  const classes = useStyles();
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = event => {
    let newSelectedEmployeeIds;

    if (event.target.checked) {
      newSelectedEmployeeIds = employees.map(employee => employee.id);
    } else {
      newSelectedEmployeeIds = [];
    }

    setSelectedEmployeeIds(newSelectedEmployeeIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedEmployeeIds.indexOf(id);
    let newSelectedEmployeeIds = [];

    if (selectedIndex === -1) {
      newSelectedEmployeeIds = newSelectedEmployeeIds.concat(
        selectedEmployeeIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedEmployeeIds = newSelectedEmployeeIds.concat(
        selectedEmployeeIds.slice(1)
      );
    } else if (selectedIndex === selectedEmployeeIds.length - 1) {
      newSelectedEmployeeIds = newSelectedEmployeeIds.concat(
        selectedEmployeeIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedEmployeeIds = newSelectedEmployeeIds.concat(
        selectedEmployeeIds.slice(0, selectedIndex),
        selectedEmployeeIds.slice(selectedIndex + 1)
      );
    }

    setSelectedEmployeeIds(newSelectedEmployeeIds);
  };

  const handleLimitChange = event => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedEmployeeIds.length === employees.length}
                    color="primary"
                    indeterminate={
                      selectedEmployeeIds.length > 0 &&
                      selectedEmployeeIds.length < employees.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Hire date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.slice(0, limit).map(employee => (
                <TableRow
                  hover
                  key={employee.id}
                  selected={selectedEmployeeIds.indexOf(employee.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedEmployeeIds.indexOf(employee.id) !== -1}
                      onChange={event => handleSelectOne(event, employee.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box alignItems="center" display="flex">
                      <Avatar
                        className={classes.avatar}
                        src={employee.avatarUrl}
                      >
                        {getInitials(employee.name)}
                      </Avatar>
                      <Typography color="textPrimary" variant="body1">
                        {employee.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    {`${employee.address.city}, ${employee.address.state}, ${employee.address.country}`}
                  </TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>
                    {moment(employee.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={employees.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  employees: PropTypes.array.isRequired
};

export default Results;
