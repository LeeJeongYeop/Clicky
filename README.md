# clicky
> Arduino Button connect Android App (Schedule Management Application)

&nbsp;

## Back-end Technology Stack
  
- Language : Javascript
- Framework : [Node.js](https://nodejs.org/), [Express](http://expressjs.com/)
- Test Server : [DigitalOcean](https://www.digitalocean.com/), [Nginx](http://nginx.org/)
- Database : MongoDB(NoSQL ODM - [Mongoose](http://mongoosejs.com/))

## REST API 
> REST API Definition

| Feature |	Method	| Request URL | Todo Status | Date (yymmdd) |
| :------------ |	:-------:	| :-----------------| :--------: | :----: |
| Join |	POST	| /clicky/user/join | complete | 15-09-17 |
| Login |	POST	| /clicky/user/login | complete | 15-09-19 |
| Btn Reg |	POST	| /clicky/btn | complete | 15-09-20 |
| Btn Delete |	DELETE	| /clicky/btn | complete | 15-09-20 |
| Btn Function Reg |	POST	| /clicky/btn/func | complete | 15-09-20 |
| Btn Function Delete |	DELETE	| /clicky/btn/func | complete | 15-09-20 |
| Btn Click(arduino) |	POST	| /clicky/ardu/click | complete | 15-11-07 |
| Btn Function View |	GET	| /clicky/btn/func/:mac_addr | complete | 15-12-05 |
| Btn List |	GET	| /clicky/btn | complete | 15-12-08 |
| Count Btn Reset  |	PUT	| /clicky/btn/func/count | complete | 15-12-12 |
| Check Btn Reset  |	PUT	| /clicky/btn/func/check | complete | 15-12-12 |