# LRC Source
A website to browse and upload .lrc file. Song database is provided by [MusicBrainz](https://musicbrainz.org).

## How to set up
Install dependency
```
composer install

npm install
```

Compile javascript
```bash
# just compile
npm run development

# compile and watch for file change
npm run watch
```

Generate application key
```
php artisan key:generate
```

Copy `.env.example` content to `.env` then migrate database
```
php artisan migrate
```

Install Laravel Passport
```
php artisan passport:install
```

Run web server
```
php artisan serve
```