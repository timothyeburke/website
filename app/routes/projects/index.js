import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return {
            "projects.mariana": "images/class-management-square.png",
            "projects.acheck": "images/acheck-square.png",
            "projects.kitcheck": "images/blue-box-square.png",
            "projects.neighborhood": "images/dc-neighborhood-square.png",
            "projects.hubot": "images/hubot.png",
            "projects.facebook": "images/facebook-recent.png",
            "projects.stats": "images/stats.png",
            "projects.foodtrucks": "images/foodtrucks.png",
            "projects.rain": "images/rain.png",
            "projects.replay": "images/cesium.png",
            "projects.site": "images/site-square.png",
            "projects.mo": "images/MO-square.png",
            "projects.annotate": "images/annotate.png",
            "projects.ringtailhomework": "images/ringtailhomework.png",
            "projects.fizzbuzz": "images/fizzbuzz.png",
            "projects.colorblind": "images/colorblind.png"
        };
    }
});
