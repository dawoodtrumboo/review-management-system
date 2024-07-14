export namespace PlaceApplicationEvent {
  export namespace PlaceCreated {
    export const key = 'place.application.place.created'

    export type Payload = {
      id: string
      userId: string
    }
  }
}
