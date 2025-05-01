import { useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { format } from "date-fns";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
  Button,
  Menu,
  MenuItem
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Clear as ClearIcon,
  PushPin as PushPinIcon,
  PushPinOutlined as PushPinOutlinedIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  ColumnPinningState,
  Row
} from "@tanstack/react-table";

interface VaccinationReportTableProps {
  vaccinations: any[];
  totalItems: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (perPage: number) => void;
}

export interface VaccinationReportTableHandle {
  getFilteredTableData: () => any[];
  getSortedTableData: () => any[];
  clearFilters: () => void;
}

type Vaccination = {
  id: number;
  studentId: number;
  driveId: number;
  vaccinationDate: string;
  notes?: string;
  student?: {
    id: number;
    studentId: string;
    name: string;
    class: string;
  };
  drive?: {
    id: number;
    vaccineName: string;
  };
};

const VaccinationReportTable = forwardRef<VaccinationReportTableHandle, VaccinationReportTableProps>(
  ({
    vaccinations,
    totalItems,
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
  }, ref) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
      left: ['studentId'],
      right: []
    });
    
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
    
    const columnHelper = createColumnHelper<Vaccination>();
    
    const columns = useMemo<ColumnDef<Vaccination, any>[]>(
      () => [
        columnHelper.accessor(row => row.student?.studentId, {
          id: 'studentId',
          header: 'Student ID',
          cell: info => info.getValue(),
          enableSorting: true,
        }),
        columnHelper.accessor(row => row.student?.name, {
          id: 'studentName',
          header: 'Name',
          cell: info => info.getValue(),
          enableSorting: true,
        }),
        columnHelper.accessor(row => row.student?.class, {
          id: 'studentClass',
          header: 'Class',
          cell: info => info.getValue(),
          enableSorting: true,
        }),
        columnHelper.accessor(row => row.drive?.vaccineName, {
          id: 'vaccineName',
          header: 'Vaccine',
          cell: info => info.getValue(),
          enableSorting: true,
        }),
        columnHelper.accessor('vaccinationDate', {
          header: 'Vaccination Date',
          cell: info => format(new Date(info.getValue()), "MMM d, yyyy"),
          enableSorting: true,
        }),
        columnHelper.accessor(row => `VD${row.drive?.id}`, {
          id: 'driveId',
          header: 'Drive ID',
          cell: info => info.getValue(),
          enableSorting: true,
        }),
      ],
      []
    );

    const table = useReactTable({
      data: vaccinations,
      columns,
      state: {
        sorting,
        columnFilters,
        globalFilter,
        columnVisibility,
        columnPinning,
      },
      enableColumnPinning: true,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      onColumnVisibilityChange: setColumnVisibility,
      onColumnPinningChange: setColumnPinning,
    });
    
    useImperativeHandle(ref, () => ({
      getFilteredTableData: () => {
        return table.getFilteredRowModel().rows.map((row: Row<Vaccination>) => row.original);
      },
      getSortedTableData: () => {
        return table.getSortedRowModel().rows.map((row: Row<Vaccination>) => row.original);
      },
      clearFilters: () => {
        setColumnFilters([]);
        setGlobalFilter('');
      }
    }));

    const handleChangePage = (_: any, newPage: number) => {
      onChangePage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeRowsPerPage(parseInt(event.target.value, 10));
    };
    
    const handleClearAllFilters = () => {
      setColumnFilters([]);
      setGlobalFilter('');
    };
    
    const handleColumnMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, columnId: string) => {
      setMenuAnchorEl(event.currentTarget);
      setSelectedColumnId(columnId);
    };
    
    const handleColumnMenuClose = () => {
      setMenuAnchorEl(null);
      setSelectedColumnId(null);
    };
    
    const handlePinColumn = (position: 'left' | 'right' | false) => {
      if (selectedColumnId) {
        table.setColumnPinning(prev => {
          const newState = { ...prev };
          
          if (newState.left) {
            newState.left = newState.left.filter(id => id !== selectedColumnId);
          }
          if (newState.right) {
            newState.right = newState.right.filter(id => id !== selectedColumnId);
          }
          
          if (position) {
            const currentPinned = newState[position] ?? [];
            newState[position] = [...currentPinned, selectedColumnId];
          }      
          
          return newState;
        });
        handleColumnMenuClose();
      }
    };

    return (
      <Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            placeholder="Search all columns..."
            size="small"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: globalFilter && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setGlobalFilter('')}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          {(globalFilter || columnFilters.length > 0) && (
            <Button 
              variant="text" 
              color="primary" 
              size="small" 
              onClick={handleClearAllFilters}
              startIcon={<ClearIcon />}
            >
              Clear All Filters
            </Button>
          )}
        </Box>
        
        <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableCell 
                      key={header.id}
                      colSpan={header.colSpan}
                      sx={{
                        position: 'sticky',
                        top: 0,
                        left: header.column.getIsPinned() === 'left' ? 0 : 'auto',
                        right: header.column.getIsPinned() === 'right' ? 0 : 'auto',
                        zIndex: header.column.getIsPinned() ? 2 : 1,
                        backgroundColor: '#f0f7ff',
                        color: 'text.primary',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 2px -2px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {header.isPlaceholder ? null : (
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              cursor: header.column.getCanSort() ? 'pointer' : 'default',
                              userSelect: 'none',
                              width: '100%'
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <Box component="span" ml={0.5}>
                              {header.column.getIsSorted() ? (
                                header.column.getIsSorted() === 'asc' ? 
                                  <ArrowUpwardIcon fontSize="small" color="primary" /> : 
                                  <ArrowDownwardIcon fontSize="small" color="primary" />
                              ) : (
                                <ArrowUpwardIcon fontSize="small" color="disabled" sx={{ opacity: 0.9 }} />
                              )}
                            </Box>
                            )}
                          </Box>
                        )}
                         <IconButton
                                                  size="small"
                                                  onClick={(e) => handleColumnMenuOpen(e, header.column.id)}
                                                >
                                                  <MoreVertIcon fontSize="small" />
                                                </IconButton>
                      </Box>
                      
                      {header.column.getCanFilter() && (
                        <Box mt={1}>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder={`Filter ${header.column.id}...`}
                            value={(header.column.getFilterValue() as string) ?? ''}
                            onChange={e => header.column.setFilterValue(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FilterIcon fontSize="small" />
                                </InputAdornment>
                              ),
                              endAdornment: typeof header.column.getFilterValue() === 'string' && header.column.getFilterValue() !== '' ? (
                                <InputAdornment position="end">
                                  <IconButton
                                    size="small"
                                    onClick={() => header.column.setFilterValue('')}
                                  >
                                    <ClearIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              ) : null,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: 'divider',
                                },
                              },
                            }}
                          />
                        </Box>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id} hover>
                  {row.getVisibleCells().map(cell => (
                    <TableCell 
                      key={cell.id} 
                      sx={{
                        position: 'sticky',
                        left: cell.column.getIsPinned() === 'left' ? 0 : 'auto',
                        right: cell.column.getIsPinned() === 'right' ? 0 : 'auto',
                        zIndex: cell.column.getIsPinned() ? 1 : 0,
                        backgroundColor: theme => cell.column.getIsPinned() ? 
                          theme.palette.background.default : theme.palette.background.paper,
                        boxShadow: cell.column.getIsPinned() ? '2px 0 5px -2px rgba(0,0,0,0.3)' : 'none',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No vaccination records found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalItems}
          page={(page - 1)}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
         <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleColumnMenuClose}
              >
                <MenuItem onClick={() => handlePinColumn('left')}>
                  <PushPinIcon fontSize="small" color="primary" sx={{ mr: 1 }} /> 
                  Pin Left
                </MenuItem>
                <MenuItem onClick={() => handlePinColumn('right')}>
                  <PushPinIcon fontSize="small" color="secondary" sx={{ mr: 1 }} />
                  Pin Right
                </MenuItem>
                <MenuItem onClick={() => handlePinColumn(false)}>
                  <PushPinOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                  Unpin
                </MenuItem>
              </Menu>
      </Box>
    );
  }
);

VaccinationReportTable.displayName = "VaccinationReportTable";

export default VaccinationReportTable;
