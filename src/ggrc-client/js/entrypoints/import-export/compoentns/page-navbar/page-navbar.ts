import {
    Component,
    OnInit,
} from '@angular/core';
// import * as queryAPI from '../../../../plugins/utils/query-api-utils';

@Component({
    selector: 'page-navbar',
    styleUrls: ['./page-navbar.css'],
    templateUrl: './page-navbar.html',
})
export class PageNavbarComponent implements OnInit{

    ngOnInit() {

        // let a: any = queryAPI.buildParam(
        //     'test',
        //     {
        //         current: 1,
        //         pageSize: 23,
        //         sortBy: 'asc',
        //     },
        //     {
        //         type: 'test',
        //         id: 42,
        //     });
        //
        // console.log(a);
    }
}
