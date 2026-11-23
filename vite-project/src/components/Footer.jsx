import Logo from './Logo.jsx'

const information = [
  { title: 'Institucional', links: ['Sobre a Drip Store', 'Nossa história', 'Trabalhe conosco', 'Privacidade'] },
  { title: 'Ajuda', links: ['Perguntas frequentes', 'Frete e entrega', 'Trocas e devoluções', 'Fale conosco'] },
]
const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-about">
          <Logo light />
          <p>Estilo que acompanha você. Descubra uma curadoria de produtos feitos para viver cada momento do seu jeito.</p>
          <div className="social-links" aria-label="Redes sociais">
            <a href="https://instagram.com" aria-label="Instagram">ig</a>
            <a href="https://facebook.com" aria-label="Facebook">f</a>
            <a href="https://youtube.com" aria-label="YouTube">▶</a>
          </div>
        </div>
        {information.map((group) => (
          <div className="footer-info" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((link) => <a href="#informacoes" key={link}>{link}</a>)}
          </div>
        ))}
        <div className="footer-contact">
          <h2>Fale com a gente</h2>
          <p>Av. das Nações Unidas, 3000<br />São Paulo, SP — 04578-000</p>
          <a href="mailto:oi@dripstore.com.br">oi@dripstore.com.br</a>
          <a href="tel:+551140004000">(11) 4000-4000</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {currentYear} Drip Store. Todos os direitos reservados.</span>
        <span className="payment-note">Feito para acompanhar seu ritmo.</span>
      </div>
    </footer>
  )
}
