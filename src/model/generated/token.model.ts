import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigDecimalColumn as BigDecimalColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_({ name: 'tokens' })
export class Token {
    constructor(props?: Partial<Token>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    creatorId!: string

    @StringColumn_({nullable: false})
    name!: string

    @StringColumn_({nullable: false})
    symbol!: string

    @StringColumn_({nullable: false})
    description!: string

    @StringColumn_({nullable: false})
    logoUrl!: string

    @StringColumn_({nullable: true})
    websiteUrl!: string | undefined | null

    @BigDecimalColumn_({nullable: false})
    totalSupply!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    bondingCurveSupply!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    ethReserve!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    reserve!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    price!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    finalPrice!: BigDecimal

    @StringColumn_({nullable: true})
    dexPoolAddress!: string | undefined | null

    @DateTimeColumn_({nullable: true})
    migratedAt!: Date | undefined | null

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: true})
    updatedAt!: Date | undefined | null
}
