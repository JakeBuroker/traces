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
    {
      field: 'title',
      headerName: 'Evidence Title',
      width: 225,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ display: 'inline-block', maxWidth: '100%', textAlign: 'center' }}>
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ display: 'inline-block', maxWidth: '100%', textAlign: 'center' }}>
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: 'datePosted',
      headerName: 'Date Posted',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ display: 'inline-block', maxWidth: '100%', textAlign: 'center' }}>
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ display: 'inline-block', maxWidth: '100%', textAlign: 'center' }}>
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: 'postedBy',
      headerName: 'Posted By',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ display: 'inline-block', maxWidth: '100%', textAlign: 'center' }}>
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Evidence',
      headerAlign: 'center',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            onClick={() => openModal(params.row)}
            style={{ cursor: 'pointer', right: '-40px' }}
            startIcon={<InfoIcon />}
          />
        </div>
      ),
    },
    {
      field: 'actions1',
      headerName: 'Toggle Secrecy',
      headerAlign: 'center',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            onClick={() => openPublicConfirmModal(params.row)}
            style={{ cursor: 'pointer', right: '-20px' }}
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
      headerAlign: 'center',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            onClick={() => openDeleteConfirmModal(params.row)}
            style={{ cursor: 'pointer', right: '-40px' }}
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
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar src={params.value || './default_avi.jpeg'} />
        </div>
      ),
    },
    { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
    { field: 'username', headerName: 'Username', width: 200, headerAlign: 'center', align: 'center' },
    { field: 'email', headerName: 'Email', width: 250, headerAlign: 'center', align: 'center' },
    { field: 'full_name', headerName: 'Full Name', width: 250, headerAlign: 'center', align: 'center' },
    { field: 'phone_number', headerName: 'Phone Number', width: 200, headerAlign: 'center', align: 'center' },
    {
      field: 'actions',
      headerName: 'Info',
      headerAlign: 'center',
      sortable: false,
      width: 125,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            onClick={() => openUserInfoModal(params.row)}
            style={{ cursor: 'pointer', right: '-30px' }}
            startIcon={<InfoIcon />}
          />
        </div>
      ),
    },
    {
      field: 'actions1',
      headerName: 'Evidence',
      headerAlign: 'center',
      sortable: false,
      width: 145,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            onClick={() => openUserEvidenceModal(params.row)}
            style={{ cursor: 'pointer', right: '-35px'  }}
            startIcon={<InfoIcon />}
          />
        </div>
      ),
    },
    {
      field: 'actions2',
      headerName: 'Delete?',
      headerAlign: 'center',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'  }}>
          <Button
            onClick={() => openDeleteUserConfirmModal(params.row)}
            style={{ cursor: 'pointer', right: '-40px'  }}
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
