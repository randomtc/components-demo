export const mockData = {
    request: [
        {
            paramData: {
                unifiedBusinessLabel: 'KA',
                consultServiceScenario: {
                    skipRiskSecurity: false,
                    bizType: 'TRADE',
                    productCode: 'MC400401000000000028',
                    internalUser: true,
                    terminalType: 'SYSTEM',
                },
                payFrom: {
                    paymentIntentCurrency: 'PLN',
                },
                paymentFactor: {
                    skipPayFailedSendMsgProcess: false,
                    fundFlowMetadata: {},
                },
                paymentMethodTypes: ['P24', 'P25'],
                partnerId: '2190170000031691',
                payTo: [
                    {
                        customerId: '2190170000031691',
                        payToAmount: {
                            cent: 98998,
                            currencyValue: '985',
                            currency: 'PLN',
                        },
                        extendInfo: {},
                    },
                ],
                paymentMethodFactor: {
                    needNotCollectCpf: false,
                    cardFactor: {
                        merchantMaintainCardRelationship: false,
                        validateCardInfo: false,
                    },
                },
                needPaymentOptionAbility: true,
            },
            paramClass: 'com.ipay.icashiercore.common.service.facade.request.PaymentMethodQueryRequest',
            paramIndex: 0,
        },
    ],
};
export const testData11 = {
    "success": true,
    "dirs": [
        "app/xxx/xxx/xxx",
        "app/xxx/xx/xx"
    ]
}