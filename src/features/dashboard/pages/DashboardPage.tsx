// One table for both roles. Protect hides add/edit/delete for viewers.

import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { useAuth } from '../../auth/authProvider'
import { Protect } from '../../../shared/Protect'
import {
  initialSites,
  siteRegions,
  siteStatuses,
  type Site,
} from '../mockResources'

export function DashboardPage() {
  const { user, signOut } = useAuth()
  const [sites, setSites] = useState(initialSites)
  const [draft, setDraft] = useState<Site | null>(null)
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null)

  const isReadonly = user?.role === 'readonly'

  function openAdd() {
    setDraft({
      id: `site-${Date.now()}`,
      name: '',
      region: siteRegions[0],
      status: 'Up',
    })
  }

  function saveDraft() {
    if (!draft || !draft.name.trim()) {
      return
    }

    setSites((sites) => {
      const index = sites.findIndex((site) => site.id === draft.id)
      // New site: id isn't in the table yet, so append.
      if (index === -1) {
        return [...sites, draft]
      }
      // Edit: copy the list and swap that row. Don't append or the old one stays.
      const next = [...sites]
      next[index] = draft
      return next
    })
    
    setDraft(null)
  }

  function confirmDelete() {
    if (!siteToDelete) {
      return
    }

    setSites((sites) => sites.filter((site) => site.id !== siteToDelete.id))
    setSiteToDelete(null)
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sites
          </Typography>
          <Typography>{user?.name}</Typography>
          <Chip size="small" color="secondary" label={isReadonly ? 'Viewer' : 'Editor'} />
          <Button color="inherit" onClick={signOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        {isReadonly && (
          <Alert severity="info" sx={{ mb: 2 }}>
            You have read-only access. Edit actions are hidden.
          </Alert>
        )}

        <Protect permission="edit">
          <Button variant="contained" sx={{ mb: 2 }} onClick={openAdd}>
            Add site
          </Button>
        </Protect>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.map((site) => (
              <TableRow key={site.id}>
                <TableCell>{site.name}</TableCell>
                <TableCell>{site.region}</TableCell>
                <TableCell>{site.status}</TableCell>
                <TableCell>
                  <Protect permission="edit">
                    <Button onClick={() => setDraft(site)}>Edit</Button>
                    <IconButton color="error" aria-label={`Delete ${site.name}`} onClick={() => setSiteToDelete(site)}>
                      <DeleteIcon />
                    </IconButton>
                  </Protect>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>

      {draft && (
        <Dialog open onClose={() => setDraft(null)}>
          <DialogTitle>{sites.some((site) => site.id === draft.id) ? 'Edit site' : 'Add site'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="dense"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="site-region-label">Region</InputLabel>
              <Select
                labelId="site-region-label"
                label="Region"
                value={draft.region}
                onChange={(e) => setDraft({ ...draft, region: e.target.value })}
              >
                {siteRegions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl margin="dense">
              <FormLabel id="site-status-label">Status</FormLabel>
              <RadioGroup
                row
                aria-labelledby="site-status-label"
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value === 'Down' ? 'Down' : 'Up' })}
              >
                {siteStatuses.map((status) => (
                  <FormControlLabel key={status} value={status} control={<Radio />} label={status} />
                ))}
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDraft(null)}>Cancel</Button>
            <Button variant="contained" onClick={saveDraft} disabled={!draft.name.trim()}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {siteToDelete && (
        <Dialog open onClose={() => setSiteToDelete(null)}>
          <DialogTitle>Delete site?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {siteToDelete.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSiteToDelete(null)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}