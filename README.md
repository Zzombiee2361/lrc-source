# LRC Source
A website to browse and upload .lrc file. Song database is provided by [MusicBrainz](https://musicbrainz.org).

## How to set up
Install composer dependency
```
composer install
```

Install npm dependecy
```
npm install
```

Compile javascript
```
npm run development
```

Or watch for file change
```
npm run watch
```

Generate application key
```
php generate:key
```

Migrate database
```
php artisan migrate
```

Run web server
```
php artisan serve
```