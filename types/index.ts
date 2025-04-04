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
export interface UserDetail {
  id?: number;
  email: string;
  fullName: string;
  password?: string;
  userStatusId?: number;
}
export interface FetchUserResponse {
  status: number
  data: {
    list: UserDetail[]
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
  data: {
    list: Meeting[],
    pagination: {
      limit: number;
      pageNo: number;
      totalItemCount: number;
      numberOfPages: number;
    }

  };
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

export interface FetchBookingWIthIdResponse {
  status: number;
  message: string;
  data: {
    id: number;
    agenda: string;
    meetingDate: string;
    meetingEndDate: string;
    startDateTime: string;
    endDateTime: string;
    frequency: number;
    parentId: number;
    createdAt: string;
    room: {
      id: number;
      roomName: string;
      pax: number;
      hexColor: string;
    };
    user: {
      id: number;
      fullName: string;
      email: string;
    };
    recurrencePattern: {
      id: number;
      recurrencePattern: string;
    };
    weekday: {
      id: number;
      weekday: string;
    };
    isRecurring: boolean;
    members: {
      id: number;
      fullName: string;
      email: string;
    }[];
  };
}

export interface FormData {
  id?: number;
  agenda: string;
  meetingDate: string;
  meetingEndDate: string;
  startTime: string;
  endTime: string;
  roomId: number;
  userId: number | undefined;
  memberIds: number[];
  isRecurring: boolean;
  option?: string;
  recurrencePatternId: number | undefined;
  frequency: number | undefined;
  weekdayId: number | undefined;
  weekday?: string
}

export interface EditBookedMeetingRoomFormData {
  agenda: string;
  meetingDate: string;
  meetingEndDate?: string;
  startTime: string;
  endTime: string;
  roomId: number;
  memberIds: number[];
  isRecurring: boolean;
  option: string;
  recurrencePatternId?: number | null;
  frequency?: number | null;
  weekdayId?: number | null;
}

export interface FetchMeetingParams {
  roomId?: number;
  fromDate?: string;
  toDate?: string;
  status?: string;
  searchTerm?: string;
  myBookingsOnly?: boolean;
  pageNo?: number;
  limit?: number;
}

export interface AddBookingFormData {
  agenda: string;
  meetingDate: string;
  meetingEndDate?: string;
  startTime: string;
  endTime: string;
  roomId: number;
  userId: number;
  memberIds: number[];
  isRecurring: boolean;
  recurrencePatternId?: number | null;
  frequency?: number | null;
  weekdayId?: number | null;
}

export interface LoginResponse {
  status: number;
  data: {
    isTwoFAEnabled: boolean;
    accessToken: string;
  };
  message: string;
}

export interface RefreshResponse {
  data: {
    accessToken: string;
  };
  message: string;
}
export interface GoogleSSOCallbackResponse {
  status: number;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface EditBookedMeetingRoomResponse {
  statusCode: number;
  url: string;
  method: string;
  message: string;
  timestamp: string;
}