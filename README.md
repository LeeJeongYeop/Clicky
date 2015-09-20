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
| Join |	POST	| /user/join | complete | 15-09-17 |
| Login |	POST	| /user/login | complete | 15-09-19 |
| Btn Reg |	POST	| /btn | complete | 15-09-20 |
| Btn Delete |	DELETE	| /btn | complete | 15-09-20 |
| Btn Function Reg |	POST	| /btn/func | complete | 15-09-20 |
| Btn Function Edit |	PUT	| /btn/func | complete | 15-09-20 |
| Btn Function Delete |	DELETE	| /btn/func | complete | 15-09-20 |