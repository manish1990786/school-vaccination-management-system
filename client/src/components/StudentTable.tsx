import { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TablePagination,
  Tooltip,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Menu,
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Vaccines as VaccinesIcon,
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
} from "@tanstack/react-table";

interface StudentTableProps {
  students: any[];
  totalItems: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (perPage: number) => void;
  onEdit: (student: any) => void;
  onDelete: (id: number) => void;
  onUpdateVaccination: (student: any) => void;
}

type Student = {
  id: number;
  studentId: string;
  name: string;
  class: string;
  gender: string;
  dateOfBirth: string;
  parentName: string;
  parentContact: string;
  address?: string;
  vaccinationStatus?: string;
  vaccinations?: any[];
};

function StudentTable({
  students,
  totalItems,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
  onEdit,
  onDelete,
  onUpdateVaccination,
}: StudentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ['studentId'],
    right: []
  });

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  
  const columnHelper = createColumnHelper<Student>();
  
  const columns = useMemo<ColumnDef<Student, any>[]>(
    () => [
      columnHelper.accessor('studentId', {
        header: 'Student ID',
        cell: info => info.getValue(),
        footer: props => props.column.id,
        enableSorting: true,
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
        footer: props => props.column.id,
        enableSorting: true,
      }),
      columnHelper.accessor('class', {
        header: 'Class',
        cell: info => info.getValue(),
        footer: props => props.column.id,
        enableSorting: true,
      }),
      columnHelper.accessor('gender', {
        header: 'Gender',
        cell: info => info.getValue(),
        footer: props => props.column.id,
        enableSorting: true,
        filterFn: (row, columnId, filterValue) => {
          const gender = row.getValue(columnId) as string;
          
          if (!filterValue || filterValue === 'all') {
            return true;
          }
          
          return gender === filterValue;
        },
      }),
      columnHelper.accessor(row => row, {
        id: 'vaccinationStatus',
        header: 'Vaccination Status',
        cell: info => {
          const student = info.getValue();
          const isVaccinated = student.vaccinations && student.vaccinations.length > 0;
          return isVaccinated ? 
            <Chip label="Vaccinated" color="success" size="small" /> : 
            <Chip label="Not Vaccinated" color="warning" size="small" />;
        },
        footer: props => props.column.id,
        enableSorting: true,
        filterFn: (row, columnId, filterValue) => {
          const student = row.original;
          const isVaccinated = student.vaccinations && student.vaccinations.length > 0;
          
          if (!filterValue || filterValue === 'all') {
            return true;
          }
          if (filterValue === 'vaccinated') {
            return isVaccinated === true;
          }
          if (filterValue === 'not_vaccinated') {
            return isVaccinated === false;
          }
          
          return true;
        },
      }),
      columnHelper.accessor(row => row, {
        id: 'actions',
        header: 'Actions',
        cell: info => {
          const student = info.getValue();
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Edit Student">
                <IconButton 
                  size="small" 
                  onClick={() => onEdit(student)}
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Update Vaccination Status">
                <IconButton 
                  size="small" 
                  onClick={() => onUpdateVaccination(student)}
                  color="success"
                >
                  <VaccinesIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Delete Student">
                <IconButton 
                  size="small" 
                  onClick={() => onDelete(student.id)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
        footer: props => props.column.id,
        enableSorting: false,
      }),
    ],
    [onEdit, onDelete, onUpdateVaccination]
  );

  const table = useReactTable({
    data: students,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnPinning,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    enableColumnPinning: true,
  });

  const handleChangePage = (_: any, newPage: number) => {
    onChangePage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeRowsPerPage(parseInt(event.target.value, 10));
  };
  
  const handleColumnMenuOpen = (event: React.MouseEvent<HTMLElement>, columnId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedColumnId(columnId);
  };
  
  const handleColumnMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedColumnId('');
  };
  
  const handlePinColumn = (position: 'left' | 'right' | false) => {
    if (selectedColumnId) {
      if (position) {
        setColumnPinning(prev => {
          const updatedPinning = { 
            ...(prev || {}),
            left: [...(prev?.left || [])],
            right: [...(prev?.right || [])]
          };
          
          updatedPinning.left = updatedPinning.left.filter(id => id !== selectedColumnId);
          updatedPinning.right = updatedPinning.right.filter(id => id !== selectedColumnId);
          
          if (position === 'left') {
            updatedPinning.left.push(selectedColumnId);
          } else {
            updatedPinning.right.push(selectedColumnId);
          }
          
          return updatedPinning;
        });
      } else {
        setColumnPinning(prev => {
          const updatedPinning = { 
            ...(prev || {}),
            left: [...(prev?.left || [])].filter(id => id !== selectedColumnId),
            right: [...(prev?.right || [])].filter(id => id !== selectedColumnId)
          };
          return updatedPinning;
        });
      }
    }
    handleColumnMenuClose();
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
      </Box>
      
      <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const column = header.column;
                  const isPinned = column.getIsPinned();
                  
                  return (
                    <TableCell 
                      key={header.id}
                      colSpan={header.colSpan}
                      sx={{
                        position: 'sticky',
                        top: 0,
                        left: isPinned === 'left' ? 0 : 'auto',
                        right: isPinned === 'right' ? 0 : 'auto',
                        zIndex: isPinned ? 2 : 1,
                        backgroundColor: '#f5fbff',
                        color: 'text.primary',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 2px -2px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                          {header.column.id === 'vaccinationStatus' ? (
                            <FormControl fullWidth size="small">
                              <InputLabel id={`${header.column.id}-filter-label`}>Filter Status</InputLabel>
                              <Select
                                labelId={`${header.column.id}-filter-label`}
                                value={(header.column.getFilterValue() as string) ?? 'all'}
                                onChange={e => header.column.setFilterValue(e.target.value)}
                                label="Filter Status"
                                size="small"
                              >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="vaccinated">Vaccinated</MenuItem>
                                <MenuItem value="not_vaccinated">Not Vaccinated</MenuItem>
                              </Select>
                            </FormControl>
                          ) : header.column.id === 'gender' ? (
                            <FormControl fullWidth size="small">
                              <InputLabel id={`gender-filter-label`}>Filter Gender</InputLabel>
                              <Select
                                labelId={`gender-filter-label`}
                                value={(header.column.getFilterValue() as string) ?? 'all'}
                                onChange={e => header.column.setFilterValue(e.target.value)}
                                label="Filter Gender"
                                size="small"
                              >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
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
                          )}
                        </Box>
                      )}
                    </TableCell>
                  );
                })}
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
                        theme.palette.background.default : 'inherit',
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
                    No students found
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

export default StudentTable;
