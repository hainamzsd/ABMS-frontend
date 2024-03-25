export interface Post {
    id: string,
    title: string,
    content: string,
    image: string,
    createUser: string,
    createTime: string,
    modifyUser: string | null,
    modifyTime: string | null,
    status: number,
    buildingId: string,
    type: number,
}