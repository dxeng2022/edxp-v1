function Footer() {
    return (
    <div className="footer">

        <div className="contact">
            <img src={ process.env.PUBLIC_URL + '/img/contact.png' } alt='img' className='footerimg' />
            Contact Us
        </div>

        <div className="border">
        </div>

        <div className="info">
            <div className="mail">
                <img src={ process.env.PUBLIC_URL + '/img/mail.png'} alt='img' className='footerimg' />
                dxeng@wise.co.kr
            </div>
            <div className="phone">
                <img src={ process.env.PUBLIC_URL + '/img/phone.png' } alt='img' className='footerimg' />
                02-6246-1400
            </div>
        </div>
        
    </div>
    )
}

export default Footer;