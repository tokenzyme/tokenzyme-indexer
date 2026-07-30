import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_({ name: 'social_media' })
export class SocialMedia {
    constructor(props?: Partial<SocialMedia>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: true})
    xUrl!: string | undefined | null

    @StringColumn_({nullable: true})
    telegramUrl!: string | undefined | null

    @StringColumn_({nullable: true})
    discordUrl!: string | undefined | null

    @StringColumn_({nullable: true})
    redditUrl!: string | undefined | null

    @StringColumn_({nullable: true})
    facebookUrl!: string | undefined | null

    @StringColumn_({nullable: true})
    instagramUrl!: string | undefined | null

    @DateTimeColumn_({nullable: false})
    createdAt!: Date
}
