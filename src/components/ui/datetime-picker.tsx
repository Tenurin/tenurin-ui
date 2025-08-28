import React, { useState, useEffect, forwardRef } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Input } from './input';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DateTimePickerProps {
  currentDateTime?: Date;
  onChange?: (dateTime: Date | undefined) => void;
  disabled?: boolean;
  showLabel?: boolean;
}

export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  ({ currentDateTime, onChange, disabled = false, showLabel = true }, ref) => {
    const [date, setDate] = useState<Date | undefined>(currentDateTime);
    const [isPopoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
      setDate(currentDateTime);
    }, [currentDateTime]);

    const handleDateSelect = (selectedDay: Date | undefined) => {
      if (!selectedDay) return;

      const hours = date?.getHours() ?? 0;
      const minutes = date?.getMinutes() ?? 0;
      const seconds = date?.getSeconds() ?? 0;

      const newDate = new Date(selectedDay);
      newDate.setHours(hours, minutes, seconds);

      setDate(newDate);
      if (onChange) {
        onChange(newDate);
      }
      setPopoverOpen(false);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const timeValue = e.target.value;
      if (!timeValue) return;

      const baseDate = date ? new Date(date) : new Date();

      const [hours, minutes, seconds] = timeValue.split(':').map(Number);

      baseDate.setHours(hours, minutes, seconds || 0);

      setDate(baseDate);
      if (onChange) {
        onChange(baseDate);
      }
    };

    if (disabled) {
      return (
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
          disabled
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'dd/MM/yyyy, hh:mm a')
          ) : (
            <span>Select date and time</span>
          )}
        </Button>
      );
    }

    return (
      <div ref={ref} className="flex w-full flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          {showLabel && (
            <Label htmlFor="date-picker" className="px-1">
              Date
            </Label>
          )}
          <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className={cn(
                  'w-full justify-between text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <span>{date ? format(date, 'PPP') : 'Select date'}</span>
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Picker */}
        <div className="flex flex-1 flex-col gap-2 ">
          {showLabel && (
            <Label htmlFor="time-picker" className="px-1">
              Time
            </Label>
          )}
          <Input
            id="time-picker"
            type="time"
            step="1"
            value={date ? format(date, 'HH:mm:ss') : '00:00:00'}
            onChange={handleTimeChange}
            className="bg-background"
          />
        </div>
      </div>
    );
  }
);

DateTimePicker.displayName = 'DateTimePicker';
