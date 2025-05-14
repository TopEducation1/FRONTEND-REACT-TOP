const Footer = () => {
    return (
        <footer className="footer container m-auto">
            <div className="footer-section section-links">
                <a href="/politicas-privacidad">Políticas de privacidad</a>
            </div>
            <div className="footer-section section-logo">
                <img src="/assets/logos/logo-top-education.png" alt="Logo Top.Education" />
            </div>
            <div className="footer-section section-social">
                <h3>Síguenos en redes sociales:</h3>
                <div className="section-social-r">
                    <a href="https://www.instagram.com/topeducationofficial/" className="social-link">
                        <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-instagram"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M16.5 7.5v.01" /></svg>
                    </a>
                    <a href="https://www.linkedin.com/company/topdoteducation/" className="social-link">
                        <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 11v5" /><path d="M8 8v.01" /><path d="M12 16v-5" /><path d="M16 16v-3a2 2 0 1 0 -4 0" /></svg>
                    </a>
                    <a href="https://www.tiktok.com/@topeducationofficial" className="social-link">
                        <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-tiktok"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" /></svg>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;