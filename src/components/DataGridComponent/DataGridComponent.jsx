import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTime } from 'luxon';

const DataGridComponent = ({
  data,
  view,
  openModal,
  openPublicConfirmModal,
  openDeleteConfirmModal,
  openDeleteUserConfirmModal,
  openUserEvidenceModal,
  openUserInfoModal,
}) => {
  // Define columns for the evidence data grid
  const evidenceColumns = [
    { field: 'title', headerName: 'Evidence Title', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'datePosted', headerName: 'Date Posted', width: 200 },
    { field: 'notes', headerName: 'Notes', width: 200 },
    { field: 'postedBy', headerName: 'Posted By', width: 200 },
    {
      field: 'actions',
      headerName: 'Evidence',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => openModal(params.row)}
            style={{ cursor: 'pointer', marginRight: '5px' }}
            startIcon={<InfoIcon />}
          />
        </div>
      ),
    },
    {
      field: 'actions1',
      headerName: 'Toggle Secrecy',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => openPublicConfirmModal(params.row)}
            style={{ cursor: 'pointer', marginRight: '5px' }}
            startIcon={params.row.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
          >
            {params.row.isPublic ? 'Public' : 'Hidden'}
          </Button>
        </div>
      ),
    },
    {
      field: 'actions2',
      headerName: 'Delete?',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => openDeleteConfirmModal(params.row)}
            style={{ cursor: 'pointer', marginRight: '5px' }}
            startIcon={<DeleteIcon />}
            color='error'
          />
        </div>
      ),
    },
  ];

  // Define columns for the user data grid
  const userColumns = [
    {
      field: 'avatar_AWS_URL',
      headerName: 'Avatar',
      width: 70,
      renderCell: (params) => (
        <Avatar src={params.value || './default_avi.jpeg'} />
      ),
    },
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'full_name', headerName: 'Full Name', width: 200 },
    { field: 'phone_number', headerName: 'Phone Number', width: 200 },
    {
      field: 'actions',
      headerName: 'Info',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => openUserInfoModal(params.row)}
            style={{ cursor: 'pointer', marginRight: '5px' }}
            startIcon={<InfoIcon />}
          />
        </div>
      ),
    },
    {
      field: 'actions1',
      headerName: 'Evidence',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => openUserEvidenceModal(params.row)}
            style={{ cursor: 'pointer', marginRight: '5px' }}
            startIcon={<InfoIcon />}
          />
        </div>
      ),
    },
    {
      field: 'actions2',
      headerName: 'Delete?',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => openDeleteUserConfirmModal(params.row)}
            style={{ cursor: 'pointer', marginRight: '5px' }}
            startIcon={<DeleteIcon />}
            color='error'
          />
        </div>
      ),
    },
  ];

  // Map evidence data to the format expected by the data grid
  const evidenceRows = data.evidence.map((item) => ({
    id: item.id,
    title: item.title,
    location: item.location,
    datePosted: DateTime.fromISO(item.date_posted).toLocaleString(DateTime.DATETIME_MED),
    notes: item.notes,
    aws_url: item.aws_url,
    postedBy: item.full_name,
    isPublic: item.is_public,
    media_type: item.media_type,
  }));

  // Map user data to the format expected by the data grid
  const userRows = data.users.map((user) => ({
    id: user.id,
    avatar_AWS_URL: user.avatar_AWS_URL || './default_avi.jpeg',
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    phone_number: user.phone_number,
    role: user.role,
    video_watched: user.video_watched,
  }));

  // Return statement for rendering the data grid with the appropriate columns and rows based on the view
  return (
    <DataGrid
      rows={view === 'evidence' ? evidenceRows : userRows}
      columns={view === 'evidence' ? evidenceColumns : userColumns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      checkboxSelection={false}
      disableSelectionOnClick
      style={{ height: 550, width: '100%', backgroundColor: '#f7f7f7' }}
    />
  );
};

export default DataGridComponent;
