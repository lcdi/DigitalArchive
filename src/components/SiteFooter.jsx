import './SiteFooter.css'

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">

        {/* Brand column */}
        <div className="site-footer-col site-footer-brand">
          <span className="site-footer-logo">backstory</span>
          <p className="site-footer-tagline">
            A digital archiving and ethnography collection management platform
            for the Leahy Center for Digital Investigation at Champlain College.
          </p>
          <p className="site-footer-copy">
            &copy; {year} Champlain College. All rights reserved.
          </p>
        </div>

        {/* Resources column */}
        <div className="site-footer-col">
          <h3 className="site-footer-heading">Resources</h3>
          <ul className="site-footer-links">
            <li><a href="#">About Backstory</a></li>
            <li><a href="#">Leahy Center Website</a></li>
            <li><a href="#">Archiving Guidelines</a></li>
            <li><a href="#">IRB Information</a></li>
            <li><a href="#">Accessibility Statement</a></li>
          </ul>
        </div>

        {/* Contact column */}
        <div className="site-footer-col">
          <h3 className="site-footer-heading">Contact</h3>
          <address className="site-footer-address">
            <strong>Leahy Center for Digital Investigation</strong>
            <br />Champlain College
            <br />163 South Willard Street
            <br />Burlington, VT 05401
            <br />
            <a href="mailto:leahycenter@champlain.edu">leahycenter@champlain.edu</a>
          </address>
        </div>

      </div>

      <div className="site-footer-bottom">
        <span>Built by the Leahy Center for Digital Investigation</span>
        <div className="site-footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </div>
      </div>
    </footer>
  )
}
