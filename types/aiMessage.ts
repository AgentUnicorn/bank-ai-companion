export interface AIStructureResponse {
    message: string
    ui: Ui
}

export interface Ui {
    type: string
    data: MessageData
}

export interface MessageData {
    restaurant: string
    datetime: string
    partySize: number
    fullName: string
    phone: string
}
