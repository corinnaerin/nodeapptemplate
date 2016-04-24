import chai from "chai";
import chaiHttp from "chai-http";

const expect = chai.expect;

chai.use(chaiHttp);

const genericSuccess = (err, res) => {
    expect(err).to.be.null;
    expect(res.status).to.eql(200);
    expect(res).to.be.json;
    expect(res.body.success).to.be.true;
};

describe('Under Construction REST API', () => {
    it('should respond to GET /construction by returning a success message', (done) => {
        chai.request('localhost:8080')
            .get('/api/construction')
            .end((err, res) => {
                genericSuccess(err, res);
                expect(res.body.imageURL).to.eql('images/underconstruction.gif');
                done();
            });
    });
});