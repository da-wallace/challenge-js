export interface IUser {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  id: number;
  content: string;
  userId: number;
  user: IUser;
  metadata: IMetaData[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMetaData {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  keywords: string;
  provider: string;
  type: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
