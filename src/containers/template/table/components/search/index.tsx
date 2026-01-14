import { Search } from 'lucide-react'
import React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/atoms/accordion'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'

type TableSearchProps = {}

const TableSearch: React.FC<React.PropsWithChildren<TableSearchProps>> = () => {
  return (
    <Accordion type="single" collapsible defaultValue="search" className="w-full">
      <AccordionItem value="search" className="border-b-0">
        <AccordionTrigger className="hover:no-underline py-2">Search</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-4 items-end p-1">
            <div className="grid gap-2">
              <Label htmlFor="search">Search:</Label>
              <Input id="search" placeholder="Search..." className="w-[200px]" />
            </div>
            <div className="grid gap-2">
              <Label>Status:</Label>
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">published</SelectItem>
                  <SelectItem value="draft">draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Star:</Label>
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Star" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">★</SelectItem>
                  <SelectItem value="2">★★</SelectItem>
                  <SelectItem value="3">★★★</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button type="button">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default TableSearch
