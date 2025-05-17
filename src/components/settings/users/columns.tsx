import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users } from "@/hooks/use-users";
import { useSortable } from "@dnd-kit/sortable";
import { IconDotsVertical, IconGripVertical } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

interface colsProps {
  onEdit: (user: Users) => void;
}

export const columns = ({ onEdit }: colsProps): ColumnDef<Users>[] => [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Estatus",
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue?.length) return true;
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge variant={user.status === "A" ? "success" : "destructive"}>
          {user.status === "A" ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "Role",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge variant="default">
          {user.roleId ? user.Role?.name : "No Role"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
    cell: ({ row }) => format(row.original.createdAt, "dd/MM/yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-42">
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
