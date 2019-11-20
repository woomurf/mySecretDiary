window.onload = function(){
    /* update 에서 이미지 삭제 기능 */
    var btnDeletes = document.getElementsByClassName("btnDelete");
    var dlist = document.getElementById("deleteImage");

    for(let i = 0; i < btnDeletes.length; i++){
        btnDeletes[i].onclick = function(){
            dlist.value += this.id + ",";
            document.getElementById(`image${this.id}`).src = "";
            this.style.visibility = "hidden";
            
        }
    }
}