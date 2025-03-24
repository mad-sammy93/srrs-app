//ROOM
export interface RoomData { //while adding room
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

export interface Room { //while fetching room items
  id: number;
  roomName: string;
  pax: number;
  hexColor: string;
}
export interface FetchRoomResponse {
  status: number;
  data: {
    list: Room[];
  };
  message: string;
}

//USER
export interface User {
 id: number;
 email: string;
 fullName: string;
 userStatusId: number;
}
export interface FetchUserResponse {
  status: number
  data: {
    list: User[]
  }
  message: string
}

//MEETING
export interface Meeting {
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
  data: { list: Meeting[] };
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