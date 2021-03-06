/*!
 Copyright (C) 2016 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
describe('CMS.Models.Relationship getRelationshipBetweenInstances() method',
  function () {
    var method;
    var instance1;
    var instance2;

    beforeAll(function () {
      method = CMS.Models.Relationship.getRelationshipBetweenInstances;

      spyOn(CMS.Models.Relationship, 'findInCacheById')
        .and.callFake(function (id) {
          return {id: id};
        });
      spyOn(console, 'warn');
    });

    it('return intersecting Relationships', function (done) {
      var result;
      instance1 = {
        related_sources: [{id: 1}, {id: 2}, {id: 3}],
        related_destinations: [{id: 4}]
      };
      instance2 = {
        related_sources: [{id: 4}, {id: 5}, {id: 6}],
        related_destinations: [{id: 7}]
      };

      result = method(instance1, instance2);

      result.then(function (res) {
        expect(res[0]).toEqual({id: 4});
        done();
      });
    });

    it('returns undefined for not related instances', function (done) {
      var result;

      instance1 = {
        related_sources: [{id: 1}, {id: 2}, {id: 3}],
        related_destinations: [{id: 4}],
        refresh: function () {
          return this;
        }
      };
      instance2 = {
        related_sources: [{id: 7}, {id: 5}, {id: 6}],
        related_destinations: [{id: 8}],
        refresh: function () {
          return this;
        }
      };

      result = method(instance1, instance2);

      result.then(function (res) {
        expect(res).toEqual([]);
        done();
      });
    });

    it('returns undefined for not related instances, without refresh',
      function (done) {
        var result;
        instance1 = {
          related_sources: [{id: 1}, {id: 2}, {id: 3}],
          related_destinations: [{id: 4}]
        };
        instance2 = {
          related_sources: [{id: 7}, {id: 5}, {id: 6}],
          related_destinations: [{id: 8}]
        };

        result = method(instance1, instance2, true);

        result.then(function (res) {
          expect(res).toEqual([]);
          done();
        });
      });

    it('returns intersecting RS after refresh instance', function (done) {
      var result;
      instance1 = {
        related_sources: [{id: 1}, {id: 2}, {id: 3}],
        related_destinations: [{id: 4}],
        refresh: function () {
          return this;
        }
      };
      instance2 = {
        related_sources: [{id: 7}, {id: 5}, {id: 6}],
        related_destinations: [{id: 8}],
        refresh: function () {
          var self = this;
          self.related_destinations.push({id: 4});
          return self;
        }
      };

      result = method(instance1, instance2);

      result.then(function (res) {
        expect(res[0]).toEqual({id: 4});
        done();
      });
    });

    it('returns all RS for multiple intersection', function (done) {
      var result;
      instance1 = {
        related_sources: [{id: 1}, {id: 2}, {id: 3}],
        related_destinations: [{id: 4}, {id: 5}]
      };
      instance2 = {
        related_sources: [{id: 4}, {id: 7}, {id: 5}, {id: 6}],
        related_destinations: [{id: 8}]
      };

      result = method(instance1, instance2);

      result.then(function (res) {
        expect(res.length).toEqual(2);
        expect(console.warn.calls.count()).toEqual(1);
        done();
      });
    });
  });
