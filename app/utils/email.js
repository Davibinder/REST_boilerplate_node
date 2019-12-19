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
 * SMTP setup and E-mail template
 */

const nodemailer = require("nodemailer");

let emailUtil = {}
const smtpSetup =  {
    TRANSPORT: {
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: "dsingh@chicmic.co.in",
            pass: "T4MZtSzyVRfc0Dv3"
        },
    }
}

emailUtil.transporter = nodemailer.createTransport(smtpSetup.TRANSPORT);

emailUtil.getPasswordResetURL = (user, token) =>
'http://localhost:5000/api/users/resetpass/?token='+token;

emailUtil.resetPasswordTemplate = (user, url) => {
  const from = process.env.EMAIL_LOGIN || "no-reply@accessgame.in"
  const to = user.email
  const subject = "Access Game Password Reset"
  const html = `
  <p>Hey ${user.name || user.email},</p>
  <p>We heard that you lost your password. Sorry about that!</p>
  <p>But don’t worry! You can use the following link to reset your password:</p>
  <a href=${url}>${url}</a>
  <p>If you don’t use this link within 1 hour, it will expire.</p>
  `
  return { from, to, subject, html }
}

module.exports = emailUtil;