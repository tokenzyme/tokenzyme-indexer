import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, BigDecimalColumn as BigDecimalColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_({ name: 'dex_liquidities' })
export class DexLiquidity {
    constructor(props?: Partial<DexLiquidity>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    tokenId!: number

    @BigDecimalColumn_({nullable: false})
    ethLiquidity!: BigDecimal

    @BigDecimalColumn_({nullable: false})
    tokenLiquidity!: BigDecimal

    @DateTimeColumn_({nullable: false})
    createdAt!: Date
}
