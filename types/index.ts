export interface RoomItem {
  id: number
  agenda: string
  meetingDate: string
  startDateTime: string
  endDateTime: string
  isRecurring: boolean
  createdAt: string
  room: {
    id: number
    roomName: string
    hexColor: string
  }
  paxCount: number
}

export interface UserItem {
 id: number;
 email: string;
 fullName: string;
 userStatusId: number;
}
export interface MeetingItem {
  id: number;
  agenda: string;
  meetingDate: string;
  startDateTime: string;
  endDateTime: string;
  isRecurring: boolean;
  createdAt: string;
  room: {
    id: number;
    roomName: string;
    hexColor: string;
  };
  paxCount: number;
}
export interface FetchMeetingResponse {
  status: number;
  data: { list: MeetingItem[] };
  message: string;
}

export interface BookMeeting {
  id: number;
  agenda: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
  roomId: number;
  userId: number;
  memberIds: number[];
  isRecurring: boolean;
  recurrencePatternId: number;
  frequency: number;
}
export interface BookMeetingRoomResponse {
  status: number;
  data: BookMeeting;
  message: string;
}