import { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Checkbox } from '@/components/atoms/checkbox'
import { DataTable, PaginationOptions } from '@/components/molecules/data-table'

type User = {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  location: string
  company: {
    name: string
    logo: string
  }
  status: 'Online' | 'Offline'
}

const data: User[] = [
  {
    id: '1',
    name: 'John Carter',
    email: 'john@google.com',
    avatar: 'https://github.com/shadcn.png',
    phone: '(414) 907 - 1274',
    location: 'United States',
    company: {
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png',
    },
    status: 'Online',
  },
  {
    id: '2',
    name: 'Sophie Moore',
    email: 'sophie@webflow.com',
    avatar: 'https://github.com/shadcn.png',
    phone: '(240) 480 - 4277',
    location: 'United Kingdom',
    company: {
      name: 'Webflow',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Webflow_logo.svg/512px-Webflow_logo.svg.png',
    },
    status: 'Offline',
  },
  {
    id: '3',
    name: 'Matt Cannon',
    email: 'matt@facebook.com',
    avatar: 'https://github.com/shadcn.png',
    phone: '(318) 698 - 9889',
    location: 'Australia',
    company: {
      name: 'Facebook',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/512px-2021_Facebook_icon.svg.png',
    },
    status: 'Offline',
  },
  {
    id: '4',
    name: 'Graham Hills',
    email: 'graham@twitter.com',
    avatar: 'https://github.com/shadcn.png',
    phone: '(540) 627 - 3890',
    location: 'India',
    company: {
      name: 'Twitter',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png',
    },
    status: 'Online',
  },
  {
    id: '5',
    name: 'Sandy Houston',
    email: 'sandy@youtube.com',
    avatar: 'https://github.com/shadcn.png',
    phone: '(440) 410 - 3848',
    location: 'Canada',
    company: {
      name: 'YouTube',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
    },
    status: 'Offline',
  },
  {
    id: '6',
    name: 'Andy Smith',
    email: 'andy@reddit.com',
    avatar: 'https://github.com/shadcn.png',
    phone: '(504) 458 - 3268',
    location: 'United States',
    company: {
      name: 'Reddit',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Reddit_icon.svg/512px-Reddit_icon.svg.png',
    },
    status: 'Online',
  },
  {
    id: '7',
    name: 'Lilly Woods',
    email: 'lilly@spotify.com',
    avatar: 'https://github.com/shadcn.png',
    phone: '(361) 692 - 1819',
    location: 'Australia',
    company: {
      name: 'Spotify',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/512px-Spotify_logo_without_text.svg.png',
    },
    status: 'Offline',
  },
  {
    id: '8',
    name: 'Patrick Meyer',
    email: 'patrick@pinterest.com',
    avatar: 'https://github.com/shadcn.png',
    phone: '(760) 582 - 5670',
    location: 'United Kingdom',
    company: {
      name: 'Pinterest',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pinterest-logo.png/512px-Pinterest-logo.png',
    },
    status: 'Online',
  },
  {
    id: '9',
    name: 'Frances Willen',
    email: 'frances@twitch.com',
    avatar: 'https://github.com/shadcn.png',
    phone: '(216) 496 - 5864',
    location: 'Canada',
    company: {
      name: 'Twitch',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Twitch_Glitch_Logo_Purple.svg/512px-Twitch_Glitch_Logo_Purple.svg.png',
    },
    status: 'Offline',
  },
  {
    id: '10',
    name: 'Ernest Houston',
    email: 'ernest@linkedin.com',
    avatar: 'https://github.com/shadcn.png',
    phone: '(704) 339 - 8813',
    location: 'India',
    company: {
      name: 'LinkedIn',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/512px-LinkedIn_logo_initials.png',
    },
    status: 'Offline',
  },
]

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={row.original.avatar} alt={row.original.name} />
          <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-sm text-muted-foreground">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.company.logo}
          alt={row.original.company.name}
          className="h-5 w-5 object-contain"
        />
        <span>{row.original.company.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === 'Online' ? 'default' : 'secondary'}
        className={
          row.original.status === 'Online'
            ? 'bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:text-green-400'
            : 'bg-slate-500/15 text-slate-700 hover:bg-slate-500/25 dark:text-slate-400'
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      // used for actions
      // const payment = row.original

      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )
    },
  },
]

export default function UserList() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [loading, setLoading] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationOptions>({
    pageIndex: 0,
    pageSize: 10,
    total: 100, // Example: total rows from API
  })

  const handleSortingChange: import('@tanstack/react-table').OnChangeFn<
    SortingState
  > = updaterOrValue => {
    setLoading(true)
    const newSorting =
      typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue

    // Simulate API delay
    setTimeout(() => {
      setSorting(newSorting)
      setLoading(false)
    }, 1000)
  }

  const handlePaginationChange = (newPagination: PaginationOptions) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setPagination(newPagination)
      setLoading(false)
      // In real app: fetch new data based on newPagination.pageIndex and newPagination.pageSize
    }, 500)
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Here&apos;s a list of your users for this month!</p>
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        sorting={sorting}
        manualSorting={false}
        onSortingChange={handleSortingChange}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        manualPagination={true}
        pageSizeOptions={[5, 10, 20, 50, 100]}
      />
    </div>
  )
}
