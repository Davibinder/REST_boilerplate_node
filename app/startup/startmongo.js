/***********************************************
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*************************************************/

/**
 * @author Davinder Singh
 * MongoDB starter
 */

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const dbURL = "mongodb://localhost:27017/balka_dev";

module.exports = async () => {
    const options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        reconnectTries: 20,
        reconnectInterval: 2000,
    };
    await mongoose.connect(dbURL, options);
    console.log('Mongo connected at ', dbURL);
};