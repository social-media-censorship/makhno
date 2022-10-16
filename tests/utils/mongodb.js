const _ = require('lodash');
const { describe, expect, test } = require('@jest/globals');

const { ensureIndex } = require('../../utils/build-index');
const database = require('../../utils/database');
const { connect } = require('../../utils/mongo');

describe('Mongo Database', () => {

  const testcfg = { 
    mongodb: 'mongodb://localhost:27017/teskhno'
  };
  const collections = [
    "submission",
    "scheduled"
  ]
  const expectedIndex = {
    "submission": 2,
    "scheduled": 1
  }

  const mockSubmission = {
    platform: 'youtube',
    details: { videoId: 'n61ULEU7CO0' },
    nature: 'video',
    supported: true,
    id: '4cb03bfe27981bf4d3e10aba557d0a2f0e368603',
    creationTime: new Date(),
    countryCodes: [ 'XX', 'AA' ]
  };

  test(`Connect to the test DB`, async () => {
    const client = await connect(testcfg);
    /* a query to an unexiting collection
     * should just be empty */
    let readobjl = null;
    try {
      readobjl = await client
        .db()
        .collection("random-unused-collection")
        .find({})
        .toArray();
      await client.close();
    } catch(error) {
      console.log(`Error in accessing DB: ${error.message}`);
      expect.assertions(false);
    }
    expect(readobjl).toHaveLength(0);
  });

  test(`Drop test DB and Initialize indexes`, async () => {
    /* pretty dangerous game here */
    const client = await connect(testcfg);
    try {
      for(const collection of collections) {
        await client
          .db()
          .collection(collection)
          .insertOne({"x": true});

        await client
          .db()
          .collection(collection)
          .drop();
      }
    } catch(error) {
      console.log(`Error in dropping collection: ${error.message}`);
      expect.assertions(false);
    }
    await client.close();

    for(const collection of collections) {
      const r = await ensureIndex(testcfg, collection);
      expect(r).toHaveProperty(
        collection,
        expectedIndex[collection]);
    }
  });

  test(`Insert a Submission`, async () => {
    const s = await database
      .createSubmission(testcfg, mockSubmission);
    expect(s).toBe(true);
  });

  test(`Retrieve a Submission`, async () => {
    const l = await database
      .querySubmission(testcfg, { id: mockSubmission.id });
    expect(l).toHaveLength(1);
    const existing = l[0];
    expect(existing)
      .toHaveProperty('nature', mockSubmission.nature)
    expect(existing)
      .toHaveProperty('details', mockSubmission.details)
    expect(existing)
      .toHaveProperty('countryCodes', mockSubmission.countryCodes)
  });

});

