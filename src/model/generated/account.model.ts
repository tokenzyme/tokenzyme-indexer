import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "@subsquid/typeorm-store"

@Entity_({ name: 'accounts' })
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string
}
