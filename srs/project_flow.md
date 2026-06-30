# Admin registers
(clgs,universities)(username,password)//refer to college schema 
            |
# admin creates hotel allocation session
(id,academic year,timestamp,active_status)//refer to allocation schema
            | 
# student sign_up using clg details 
(this will be his/her credentials)//refer to student schema
            | 
# student attends AI interview by scheduling the slot from the given slots
            |
# AI extrats triats
(gen ai)(trait constraint Document)
            |
# student trait profile is generated
            |
# Compatibility Score Matrix generated(using ml)
            |
# Optimization Engine(google OR tools)
            |
# Room Alloction
(Recommendation table) => (RecommendatonMember for student details)
            |
# displays the recommendation and recommendationmember table for website users and admin review
            |
# Export Excel/PDF