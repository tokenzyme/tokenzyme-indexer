import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigDecimalColumn as BigDecimalColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {TradeType} from "./_tradeType"

@Entity_({ name: 'trades' })
export class Trade {
    constructor(props?: Partial<Trade>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    tokenId!: string

    @StringColumn_({nullable: false})
    accountId!: string

    @Column_("varchar", {length: 4, nullable: false})
    type!: TradeType

    @BigDecimalColumn_({nullable: false})
    tokenAmount!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    ethAmount!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    fee!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    avgPrice!: BigDecimal

    @DateTimeColumn_({nullable: false})
    createdAt!: Date
}
