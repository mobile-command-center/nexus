import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

class ConsultService {
    constructor() {
        this._client = new ApolloClient({
            uri: 'https://3bs9wim5w1.execute-api.ap-northeast-2.amazonaws.com/dev/v1/graphql'
        });
    }

    get(input) {
        return this._client
        .query({
            query: gql`
                query {
                    getConsultation(input : {
                        CONST_ID: ${input.CONST_ID}
                    }) {
                        CONST_ID
                        DATE
                        WRTR_ID
                        WRT_DATE
                        EE_ID
                        C_TEL
                        MEMO
                        P_SUBSIDY_AMT
                        AVAL_INQUIRY_PASS
                    }
                }
            `,
        });
    }

    read(input) {
        return this._client
        .query({
            query: gql`
                query {
                    readConsultation(input:{
                        ${input.first ? `first: ${input.first}`: ''}
                        ${input.last ? `last: ${input.last}`: ''}
                        ${input.before ? `before: ${input.before}`: ''}
                        ${input.after ? `after: ${input.after}`: ''}
                    }) {
                        edges {
                            CONST_ID
                            DATE
                            WRT_DATE
                            EE_ID
                            C_TEL
                            MEMO
                            P_SUBSIDY_AMT
                            AVAL_INQUIRY_PASS
                        }
                        totalCount
                        pageInfo {
                            endCursor
                            startCursor
                        }
                    }
                }
            `,
        });
    }

    search(input) {
        return this._client
            .query({
                query: gql`
                query {
                    searchConsultation(input:{
                        ${input.first ? `first: ${input.first}`: ''}
                        ${input.last ? `last: ${input.last}`: ''}
                        ${input.before ? `before: ${input.before}`: ''}
                        ${input.after ? `after: ${input.after}`: ''}
                        ${input.filter ? `filter: {
                            ${input.filter.WRT_DATE ? `WRT_DATE: {
                                    contains: "${input.filter.WRT_DATE.contains}"
                            }`: ''}
                            ${input.filter.EE_ID ? `EE_ID: {
                                    contains: "${input.filter.EE_ID.contains}"
                            }`: ''}
                            ${input.filter.C_TEL ? `C_TEL: {
                                    contains: "${input.filter.C_TEL.contains}"
                            }`: ''}
                            ${input.filter.MEMO ? `MEMO: {
                                    contains: "${input.filter.MEMO.contains}"
                            }`: ''}
                            ${input.filter.P_SUBSIDY_AMT ? `P_SUBSIDY_AMT : {
                                    contains: "${input.filter.P_SUBSIDY_AMT.contains}"
                            }`: ''}
                        }`: ''}
                    }) {
                        edges {
                            CONST_ID
                            DATE
                            WRT_DATE
                            EE_ID
                            C_TEL
                            MEMO
                            P_SUBSIDY_AMT
                            AVAL_INQUIRY_PASS
                        }
                        totalCount
                        pageInfo {
                            endCursor
                            startCursor
                        }
                    }
                }
            `,
        });
    }

    create(input) {
        return this._client
            .mutate({
                mutation: gql`
                    mutation {
                        createConsultation(input: {
                            WRTR_ID: ${`"${input.WRTR_ID}"`}
                            DATE: ${`"${input.DATE}"`}
                            ${input.EE_ID ? `EE_ID: ${`"${input.EE_ID}"`}`: ''}
                            ${input.C_TEL ? `C_TEL: ${`"${input.C_TEL}"`}`: ''}
                            ${input.MEMO ? `MEMO: ${`"${input.MEMO.replace(/\n/g, '\\n')}"`}`: ''}
                            ${input.P_SUBSIDY_AMT ? `P_SUBSIDY_AMT: ${`"${input.P_SUBSIDY_AMT}"`}`: ''}
                            AVAL_INQUIRY_PASS: ${String(input.AVAL_INQUIRY_PASS)}
                        }) {
                            CONST_ID
                        }
                    }
                `
            }); 
    }

    update(input) {
        debugger;
        return this._client
        .mutate({
            mutation: gql`
                mutation {
                    updateConsultation(input: {
                        CONST_ID: ${input.CONST_ID}
                        ${input.DATE ? `DATE: ${`"${input.DATE}"`}`: ''}
                        ${input.WRTR_ID ? `WRTR_ID: ${`"${input.WRTR_ID}"`}`: ''}
                        ${input.EE_ID ? `EE_ID: ${`"${input.EE_ID}"`}`: ''}
                        ${input.C_TEL ? `C_TEL: ${`"${input.C_TEL}"`}`: ''}
                        ${input.MEMO ? `MEMO: ${`"${input.MEMO.replace(/\n/g, '\\n')}"`}`: ''}
                        ${input.P_SUBSIDY_AMT ? `P_SUBSIDY_AMT: ${`"${input.P_SUBSIDY_AMT}"`}`: ''}
                        ${typeof input.AVAL_INQUIRY_PASS !== 'undefined' ? `AVAL_INQUIRY_PASS: ${input.AVAL_INQUIRY_PASS}`:''}
                    }) {
                        CONST_ID
                    }
                }
            `
        }); 
    }

    delete(input) {
        return this._client
        .mutate({
            mutation: gql`
                mutation {
                    deleteConsultation(input: {
                        CONST_ID: ${input.CONST_ID}
                    }) {
                        CONST_ID
                    }
                }
            `
        }); 
    }
}

export default new ConsultService();