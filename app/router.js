import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function() {
    this.route('work');
    this.route('projects', function() {
        this.route('mariana');
        this.route('acheck');
        this.route('kitcheck');
        this.route('neighborhood');
        this.route('hubot');
        this.route('facebook');
        this.route('stats');
        this.route('foodtrucks');
        this.route('rain');
        this.route('replay');
        this.route('site');
        this.route('mo');
        this.route('annotate');
        this.route('ringtailhomework');
        this.route('fizzbuzz');
        this.route('colorblind');
    });
});

export default Router;
