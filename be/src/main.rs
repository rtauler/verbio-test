use actix_cors::Cors;
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::ops::Add;

const SECRET: &str = "THIS_IS_MY_SECRET";
const EXPIRATION_MINUTES: i64 = 5;
const GREETING_MESSAGE_A: &str = "Hi, I'm a bot!";
const GREETING_MESSAGE_B: &str = "I will echo back your messages, or send you cute cat images if you send me the text \"image\".";

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Message {
    #[serde(rename = "text")]
    Text { text: String },
    #[serde(rename = "image")]
    Image { url: String },
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MessageResponse {
    response: Vec<Message>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserMessage {
    text: String,
}

async fn greet() -> HttpResponse {
    HttpResponse::Ok()
        .body("This is the API root page. You were probably not looking for this endpoint")
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct LoginRequest {
    user: String,
    password: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    session_id: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct JWT {
    exp: i64,
}

fn generate_session() -> String {
    let exp = chrono::Utc::now()
        .add(chrono::Duration::minutes(EXPIRATION_MINUTES))
        .timestamp_millis();
    encode(
        &Header::default(),
        &JWT { exp },
        &EncodingKey::from_secret(SECRET.as_bytes()),
    )
    .expect("Should be able to generate a session")
}

fn is_jwt_valid(jwt: &str) -> bool {
    let res = match decode::<JWT>(
        jwt,
        &DecodingKey::from_secret(SECRET.as_bytes()),
        &Validation::default(),
    ) {
        Ok(r) => r,
        Err(_) => return false,
    };
    let expiration_time = res.claims.exp;

    chrono::Utc::now().timestamp_millis() < expiration_time
}

fn validate_session(req: &HttpRequest) -> Result<(), ()> {
    let header = match req.headers().get("Authorization") {
        Some(h) => match h.to_str() {
            Ok(s) => s,
            Err(_) => return Err(()),
        },
        None => return Err(()),
    };

    if !header.contains("Bearer") {
        return Err(());
    }

    let token = header.replace("Bearer ", "");
    if is_jwt_valid(&token) {
        Ok(())
    } else {
        Err(())
    }
}

async fn login(req: web::Json<LoginRequest>) -> HttpResponse {
    if req.user == "admin" && req.password == "admin" {
        let session = generate_session();
        HttpResponse::Ok().json(LoginResponse {
            session_id: session,
        })
    } else {
        HttpResponse::Unauthorized().finish()
    }
}

async fn get_welcome_message(req: HttpRequest) -> HttpResponse {
    if validate_session(&req).is_err() {
        return HttpResponse::Unauthorized().finish();
    }
    let response = MessageResponse {
        response: vec![
            Message::Text {
                text: GREETING_MESSAGE_A.to_string(),
            },
            Message::Text {
                text: GREETING_MESSAGE_B.to_string(),
            },
        ],
    };
    HttpResponse::Ok().json(response)
}

async fn send_message(req: HttpRequest, message: web::Json<UserMessage>) -> HttpResponse {
    if validate_session(&req).is_err() {
        return HttpResponse::Unauthorized().finish();
    }
    let response = if message.text == "image" {
        MessageResponse {
            response: vec![
                Message::Text {
                    text: "Check this cute image of a cat:".to_string(),
                },
                Message::Image {
                    url: "https://cataas.com/cat".to_string(),
                },
            ],
        }
    } else {
        MessageResponse {
            response: vec![Message::Text {
                text: message.text.clone(),
            }],
        }
    };
    HttpResponse::Ok().json(response)
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    env_logger::from_env(env_logger::Env::default().default_filter_or("debug")).init();

    let port = std::env::var("PORT").unwrap_or_else(|_| "5556".to_string());
    let addr = format!("0.0.0.0:{}", port);
    log::info!("Server started at {}", &addr);
    HttpServer::new(|| {
        App::new()
            .wrap(actix_web::middleware::Logger::default())
            .wrap(Cors::default())
            .route("/", web::get().to(greet))
            .route("/login", web::post().to(login))
            .route("/getWelcomeMessage", web::get().to(get_welcome_message))
            .route("/sendMessage", web::post().to(send_message))
    })
    .bind(addr)?
    .run()
    .await
}
