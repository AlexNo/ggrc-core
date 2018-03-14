declare module queryApi {

    interface Page {
        current: number,
        pageSize: number,
        sortBy: string,
    }

    interface Relevant {
        type: string,
        id: number,
        operation?: string,
    }

    export function buildParam(
        objName: string,
        page: Page,
        relevant: Relevant): object;
}

export = queryApi;
