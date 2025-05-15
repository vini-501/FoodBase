"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface Reservation {
  id: number;
  name: string;
  phone: string;
  email: string;
  date: Date;
  time: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled";
}

export function Reservation() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      name: "Arun Kumar",
      phone: "9876543210",
      email: "arun@example.com",
      date: new Date(2025, 4, 15),
      time: "7:00 PM",
      guests: 4,
      status: "confirmed",
    },
    {
      id: 2,
      name: "Priya Sharma",
      phone: "8765432109",
      email: "priya@example.com",
      date: new Date(2025, 4, 16),
      time: "8:30 PM",
      guests: 2,
      status: "pending",
    },
    {
      id: 3,
      name: "Vikram Singh",
      phone: "7654321098",
      email: "vikram@example.com",
      date: new Date(2025, 4, 18),
      time: "6:45 PM",
      guests: 6,
      status: "confirmed",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    time: "",
    guests: 2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "guests" ? Number.parseInt(value) || 1 : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a reservation date",
        variant: "destructive",
      });
      return;
    }

    if (!formData.time) {
      toast({
        title: "Time required",
        description: "Please select a reservation time",
        variant: "destructive",
      });
      return;
    }

    const newReservation: Reservation = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      date: date,
      time: formData.time,
      guests: formData.guests,
      status: "confirmed",
    };

    setReservations([...reservations, newReservation]);

    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      time: "",
      guests: 2,
    });

    toast({
      title: "Reservation confirmed",
      description: `Reservation for ${formData.name} on ${format(
        date,
        "PPP"
      )} at ${formData.time} has been confirmed.`,
    });
  };

  const updateReservationStatus = (
    id: number,
    status: "confirmed" | "pending" | "cancelled"
  ) => {
    const updatedReservations = reservations.map((reservation) =>
      reservation.id === id ? { ...reservation, status } : reservation
    );
    setReservations(updatedReservations);

    toast({
      title: `Reservation ${status}`,
      description: `Reservation has been ${status}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  const timeSlots = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Reservation Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>New Reservation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Customer name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {formData.time ? (
                          formData.time
                        ) : (
                          <span>Select time</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                      <div className="grid grid-cols-2 gap-2 p-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant="ghost"
                            className="justify-start"
                            onClick={() => {
                              setFormData({ ...formData, time });
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Number of Guests
                  </label>
                  <Input
                    name="guests"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Confirm Reservation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No reservations found
                  </p>
                ) : (
                  reservations.map((reservation) => (
                    <Card key={reservation.id} className="overflow-hidden">
                      <div
                        className={`p-3 ${getStatusColor(reservation.status)}`}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{reservation.name}</h3>
                          <span className="text-sm capitalize">
                            {reservation.status}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <p className="text-sm text-gray-500">Date & Time</p>
                            <p className="font-medium">
                              {format(reservation.date, "PPP")} at{" "}
                              {reservation.time}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Guests</p>
                            <p className="font-medium">
                              {reservation.guests} people
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{reservation.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{reservation.email}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {reservation.status !== "confirmed" && (
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                updateReservationStatus(
                                  reservation.id,
                                  "confirmed"
                                )
                              }
                            >
                              Confirm
                            </Button>
                          )}

                          {reservation.status !== "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() =>
                                updateReservationStatus(
                                  reservation.id,
                                  "pending"
                                )
                              }
                            >
                              Mark as Pending
                            </Button>
                          )}

                          {reservation.status !== "cancelled" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={() =>
                                updateReservationStatus(
                                  reservation.id,
                                  "cancelled"
                                )
                              }
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
